import { Switch } from "antd";
import clsx from "clsx";
import { FC, ReactNode, useState } from "react";

interface ISettingRowProps {
  title: string;
  value?: boolean;
  hidden?: boolean;
  className?: string;
  children?: ReactNode;
  tryChange?: (checked: boolean) => Promise<void>;
  rowClick?: () => void;
}

const SettingRow: FC<ISettingRowProps> = ({
  title,
  value,
  hidden,
  className,
  children,
  tryChange,
  rowClick,
}) => {
  const [loading, setLoading] = useState(false);
  const onClick = async (checked: boolean) => {
    setLoading(true);
    await tryChange?.(checked);
    setLoading(false);
  };

  if (hidden) {
    return null;
  }

  return (
    <div
      className={clsx("flex items-center justify-between p-4", className)}
      onClick={rowClick}
    >
      <div className="font-medium">{title}</div>
      {children ?? (
        <Switch
          className="bg-[#8e9aaf]"
          loading={loading}
          checked={value}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default SettingRow;
