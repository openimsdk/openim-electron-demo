import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Dropdown, Button, Menu } from "antd";
import { forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { debounce } from "throttle-debounce";
import styles from "./index.module.less";

export type SearchBarProps = {
  menus: menuItem[];
  searchCb: (value: string) => void;
};

type menuItem = {
  title: string;
  icon: JSX.Element;
  method: (idx: number) => void;
};

export type SearchBarHandle = {
  clear: () => void;
};

const SearchBar: ForwardRefRenderFunction<SearchBarHandle, SearchBarProps> = ({ menus, searchCb }, ref) => {
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  const addMenu = () => (
    <Menu className={styles.btn_menu}>
      {menus?.map((m, idx) => (
        <Menu.Item key={m.title} onClick={() => m.method(idx)} icon={m.icon}>
          {m.title}
        </Menu.Item>
      ))}
    </Menu>
  );

  const onChanged = (v: string) => {
    setInput(v);
    debounceSearch(v);
  };

  const clear = () => setInput("");

  const debounceSearch = debounce(500, searchCb);

  useImperativeHandle(ref, () => ({
    clear,
  }));

  return (
    <div className={styles.top_tools}>
      <Input allowClear value={input} onChange={(v) => onChanged(v.target.value)} placeholder={t("Search")} prefix={<SearchOutlined />} />
      <Dropdown overlay={addMenu} placement="bottomCenter" arrow>
        <Button style={{ marginLeft: "14px" }} shape="circle" icon={<PlusOutlined style={{ color: "#bac0c1" }} />} />
      </Dropdown>
    </div>
  );
};

export default forwardRef(SearchBar)