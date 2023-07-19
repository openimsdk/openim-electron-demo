import { EnterOutlined } from "@ant-design/icons";
import { useClickAway } from "ahooks";
import { Input } from "antd";
import clsx from "clsx";
import { FC, useRef, useState } from "react";

import edit_name from "@/assets/images/chatSetting/edit_name.png";

interface IEditableContentProps {
  editable?: boolean;
  value?: string;
  placeholder?: string;
  className?: string;
  textClassName?: string;
  onChange?: (value: string) => Promise<void>;
}

const EditableContent: FC<IEditableContentProps> = ({
  editable,
  value,
  placeholder,
  className,
  textClassName,
  onChange,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [editState, setEditState] = useState({
    isEdit: false,
    loading: false,
    innerValue: value,
  });

  useClickAway(() => {
    if (editState.isEdit) {
      setEditState({
        isEdit: false,
        loading: false,
        innerValue: value,
      });
    }
  }, [wrapRef]);

  const toggleEdit = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    setEditState({
      isEdit: true,
      loading: false,
      innerValue: value,
    });
  };

  const onPressEnter = async (
    e: React.KeyboardEvent<HTMLInputElement> & { target: { value: string } },
  ) => {
    setEditState((state) => ({ ...state, loading: true }));
    await onChange?.(e.target.value);
    setEditState({
      isEdit: false,
      loading: false,
      innerValue: e.target.value,
    });
  };

  return (
    <div ref={wrapRef} className={clsx("ml-3 flex items-center", className)}>
      {editState.isEdit ? (
        <Input
          value={editState.innerValue}
          placeholder={placeholder}
          maxLength={20}
          onChange={(e) =>
            setEditState((state) => ({ ...state, innerValue: e.target.value }))
          }
          onPressEnter={onPressEnter}
          suffix={<EnterOutlined rev={undefined} />}
        />
      ) : (
        <>
          <div className={clsx("mr-1 max-w-[240px] truncate", textClassName)}>
            {value}
          </div>
          {editable && (
            <img
              className="cursor-pointer"
              width={14}
              src={edit_name}
              alt="edit name"
              onClick={toggleEdit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EditableContent;
