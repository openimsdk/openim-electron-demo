import { Modal } from "antd"
import { FC } from "react"
import { ConversationItem, MergeElem, PictureElem } from "../../../../utils/open_im_sdk/types"
import ChatContent from "../ChatContent"

type MerModalProps = {
    close:()=>void;
    imgClick: (el: PictureElem) => void;
    info:MergeElem & {sender:string};
    visible: boolean;
    curCve: ConversationItem;
}

const MerModal:FC<MerModalProps> = ({close,imgClick,info,visible,curCve}) => {
    return (
        <Modal
        title={info?.title}
        visible={visible}
        footer={null}
        onCancel={close}
        getContainer={false}
        mask={false}
        width="60vw"
        className="mer_modal"
        >
        <ChatContent
              loadMore={()=>{}}
              loading={false}
              msgList={[...info!.multiMessage].reverse()}
              imgClick={imgClick}
              hasMore={false}
              curCve={curCve}
            />
        </Modal>
    )
}

export default MerModal
