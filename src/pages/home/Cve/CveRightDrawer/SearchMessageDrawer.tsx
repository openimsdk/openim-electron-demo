import { SearchOutlined } from "@ant-design/icons";
import { Empty, Input, TabPaneProps, Tabs } from "antd";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "throttle-debounce";
import { MyAvatar } from "../../../../components/MyAvatar";
import { SessionType } from "../../../../constants/messageContentType";
import { ConversationItem } from "../../../../utils/open_im_sdk/types";

export const SearchMessageDrawer = ({ curCve }: { curCve: ConversationItem }) => {
  const [activeKey, setActiveKey] = useState("1");
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      const ink: HTMLDivElement | null = window.document.querySelector(".ant-tabs-ink-bar");
      if (ink) ink.style.transform = "translateX(3px)";
    });
  }, []);

  const tabChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className="search_message">
      <Tabs activeKey={activeKey} defaultActiveKey="1" onChange={tabChange}>
        <MyTabpane curCve={curCve} tab="消息" key="1">
          <TextMessageList />
        </MyTabpane>
        <MyTabpane curCve={curCve} tab="图片" key="2"></MyTabpane>
        <MyTabpane curCve={curCve} tab="视频" key="3"></MyTabpane>
        <MyTabpane curCve={curCve} tab="文件" key="4"></MyTabpane>
      </Tabs>
    </div>
  );
};

interface MyTabpaneProps extends TabPaneProps {
  curCve: ConversationItem;
}

const MyTabpane: FC<MyTabpaneProps> = (props) => {
  const { t } = useTranslation();

  const inputOnChange = (key: React.ChangeEvent<HTMLInputElement>) => debounceSearch(key.target.value);

  const searchMessage = (key: string) => {
    const options = {
      sourceID: props.curCve.conversationType === SessionType.SINGLECVE ? props.curCve.userID : props.curCve.groupID,
      sessionType: props.curCve.conversationType,
      keywordList: [key],
      keywordListMatchType: 0,
      senderUserIDList: [],
      messageTypeList: [],
      searchTimePosition: 0,
      searchTimePeriod: 0,
      pageIndex: 0,
      count:0
    };
    // im.searchLocalMessages(options).then((res) => {
    //   console.log(res);
    // });
  };

  const debounceSearch = debounce(500, searchMessage);

  return (
    <Tabs.TabPane {...props}>
      <div className="message_search_input">
        <Input disabled onChange={inputOnChange} placeholder={"开发中~"} prefix={<SearchOutlined />} />
      </div>
      {props.children}
    </Tabs.TabPane>
  );
};

const TextMessageList = () => {
  const { t } = useTranslation();

  const TextMessageItem = () => (
    <div className="text_item">
      <MyAvatar size={36} />
      <div className="text_item_right">
        <div className="info">
          <span className="nick">李华</span>
          <span className="time">15：20</span>
        </div>
        <div>HI，我通过你的好友请求了。</div>
      </div>
    </div>
  );

  return (
    <div className="text_message_list">
      {/* <TextMessageItem /> */}
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("EmptySearch")}/>
    </div>
  );
};
