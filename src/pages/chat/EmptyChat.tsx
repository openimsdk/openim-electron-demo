import { Button, Layout } from "antd";
import { useTranslation } from "react-i18next";

import empty_chat_bg from "@/assets/images/empty_chat_bg.png";
import { emit } from "@/utils/events";

export const EmptyChat = () => {
  const { t } = useTranslation();
  const createNow = () => {
    emit("OPEN_CHOOSE_MODAL", {
      type: "CRATE_GROUP",
    });
  };

  return (
    <Layout className="no-mobile flex items-center justify-center bg-white">
      <div>
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-3 text-xl font-medium">{t("placeholder.createGroup")}</div>
          <div className="text-[var(--sub-text)]">
            {t("placeholder.createGroupToast")}
          </div>
        </div>
        <img src={empty_chat_bg} alt="" width={320} />

        <div className="mt-28 flex justify-center">
          <Button className="px-8" type="primary" onClick={createNow}>
            {t("placeholder.createNow")}
          </Button>
        </div>
      </div>
    </Layout>
  );
};
