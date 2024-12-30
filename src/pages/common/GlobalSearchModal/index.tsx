import { SearchOutlined } from "@ant-design/icons";
import {
  FriendUserItem,
  GroupItem,
  SearchMessageResultItem,
} from "@openim/wasm-client-sdk/lib/types/entity";
import { useDebounceFn } from "ahooks";
import { Input, InputRef, Modal, Tabs } from "antd";
import clsx from "clsx";
import { t } from "i18next";
import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { OverlayVisibleHandle, useOverlayVisible } from "@/hooks/useOverlayVisible";
import { IMSDK } from "@/layout/MainContentWrap";

import ContactPanel from "./ContactPanel";
import DashboardPanel from "./DashboardPanel";
import styles from "./index.module.scss";

export interface SearchData<T> {
  data: T[];
  loading: boolean;
}

export type ChatLogsItem = SearchMessageResultItem & {
  sendTime: number;
  description: string;
};

const TabKeys = ["DashBoard", "Friends", "Groups"] as const;

export type TabKey = (typeof TabKeys)[number];

const GlobalSearchModal: ForwardRefRenderFunction<OverlayVisibleHandle, unknown> = (
  _,
  ref,
) => {
  const { isOverlayOpen, closeOverlay } = useOverlayVisible(ref);

  return (
    <Modal
      title={null}
      footer={null}
      centered
      open={isOverlayOpen}
      closable={false}
      width={"70%"}
      destroyOnClose
      onCancel={closeOverlay}
      styles={{
        mask: {
          opacity: 0,
          transition: "none",
        },
      }}
      className={clsx("no-padding-modal max-w-[800px]", styles["global-search-modal"])}
      maskTransitionName=""
    >
      <GlobalSearchContent closeOverlay={closeOverlay} />
    </Modal>
  );
};

export const GlobalSearchContent = ({ closeOverlay }: { closeOverlay: () => void }) => {
  const [activeKey, setActiveKey] = useState<TabKey>("DashBoard");
  const [friends, setFriends] = useState<SearchData<FriendUserItem>>({
    data: [],
    loading: false,
  });
  const [groups, setGroups] = useState<SearchData<GroupItem>>({
    data: [],
    loading: false,
  });
  const searchBarRef = useRef<SearchBarHandle>(null);

  useEffect(() => {
    if (location.hash.startsWith("#/contact")) {
      setActiveKey("Friends");
    }
    searchBarRef.current?.focus();
    return () => {
      resetState();
    };
  }, []);

  const toggleTab = useCallback((tab: TabKey) => {
    setActiveKey(tab);
  }, []);

  const resetState = () => {
    setFriends({
      data: [],
      loading: false,
    });
    setGroups({
      data: [],
      loading: false,
    });
    setActiveKey("DashBoard");
    searchBarRef.current?.clearKeyword();
  };

  const items = [
    {
      key: "DashBoard",
      label: t("placeholder.overview"),
      children: (
        <DashboardPanel
          friends={friends}
          groups={groups}
          closeOverlay={closeOverlay}
          toggleTab={toggleTab}
        />
      ),
    },
    {
      key: "Friends",
      label: t("placeholder.contacts"),
      children: <ContactPanel {...friends} closeOverlay={closeOverlay} />,
    },
    {
      key: "Groups",
      label: t("placeholder.myGroup"),
      children: <ContactPanel {...groups} closeOverlay={closeOverlay} />,
    },
  ];

  const searchFriend = async (keyword: string) => {
    setFriends({
      data: [],
      loading: true,
    });
    let friendlist: FriendUserItem[] = [];
    try {
      const { data } = await IMSDK.searchFriends({
        keywordList: [keyword],
        isSearchNickname: true,
        isSearchRemark: true,
        isSearchUserID: true,
      });
      friendlist = data;
    } catch (error) {
      console.error(error);
    }
    setFriends({
      data: friendlist,
      loading: false,
    });
  };

  const searchGroup = async (keyword: string) => {
    setGroups({
      data: [],
      loading: true,
    });
    let groupList: GroupItem[] = [];
    try {
      const { data } = await IMSDK.searchGroups({
        keywordList: [keyword],
        isSearchGroupID: true,
        isSearchGroupName: true,
      });
      groupList = data;
    } catch (error) {
      console.error(error);
    }

    setGroups({
      data: groupList,
      loading: false,
    });
  };

  const triggerSearch = (keyword: string) => {
    if (!keyword) return;
    searchFriend(keyword);
    searchGroup(keyword);
  };

  return (
    <>
      <ForWardSearchBar ref={searchBarRef} triggerSearch={triggerSearch} />
      <Tabs
        className={styles["search-tab"]}
        defaultActiveKey="DashBoard"
        activeKey={activeKey}
        items={items}
        onChange={toggleTab as (key: string) => void}
      />
    </>
  );
};

export default memo(forwardRef(GlobalSearchModal));

type SearchBarHandle = { clearKeyword: () => void; focus: () => void };

const SearchBar: ForwardRefRenderFunction<
  SearchBarHandle,
  { triggerSearch: (value: string) => void }
> = ({ triggerSearch }, ref) => {
  const inputRef = useRef<InputRef>(null);
  const [keyword, setKeyword] = useState("");

  const { run: debounceSearch } = useDebounceFn(triggerSearch, { wait: 500 });

  const onChange = (value: string) => {
    setKeyword(value);
    debounceSearch(value);
  };

  useImperativeHandle(
    ref,
    () => ({
      clearKeyword: () => setKeyword(""),
      focus: () => inputRef.current?.focus(),
    }),
    [],
  );

  return (
    <>
      <div className="app-drag h-6"></div>
      <div className="px-6">
        <Input
          allowClear
          prefix={<SearchOutlined />}
          value={keyword}
          ref={inputRef}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </>
  );
};

const ForWardSearchBar = memo(forwardRef(SearchBar));
