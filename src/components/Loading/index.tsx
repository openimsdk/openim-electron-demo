import { Spin } from "antd"
import { FC } from "react"


type LoadingProps = {
    size?: "small" | "default" | "large"
    className?: string
    height?:string
    width?:string
    tip?:string
    style?:React.CSSProperties
}

export const Loading:FC<LoadingProps> = ({size,className,height,width,tip,style}) => {
    return (
        <div className={className} style={{width:width??"100%",height: height??"100%",display:"flex",justifyContent:"center",alignItems:"center",...style}}>
             <Spin tip={tip??'Loading...'} size={size} />
        </div>
    )
}

Loading.defaultProps = {
    size:"large"
}