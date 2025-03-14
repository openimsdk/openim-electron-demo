import { Button, Result } from "antd";
import { t } from "i18next";
import { useRouteError } from "react-router-dom";

const GlobalErrorElement = () => {
  const error = useRouteError();

  const reload = () => {
    window.location.reload();
  };

  console.error("GlobalErrorElement");
  console.error(error);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Result
        status="404"
        subTitle={t("toast.somethingError")}
        extra={
          <Button type="primary" onClick={reload}>
            {t("placeholder.recover")}
          </Button>
        }
      />
    </div>
  );
};

export default GlobalErrorElement;
