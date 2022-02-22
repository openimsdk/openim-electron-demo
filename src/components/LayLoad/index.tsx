import { useInViewport } from "ahooks"
import { FC } from "react"

type LayLoadProps = {
    targetRef: React.RefObject<HTMLElement>
    skeletonCmp: JSX.Element;
    forceLoad?: boolean
}

const LayLoad:FC<LayLoadProps> = ({targetRef,children,skeletonCmp,forceLoad}) => {
    const [ inViewPort ] = useInViewport(targetRef);

    return (
        <>
            {
                (inViewPort||forceLoad)?children:skeletonCmp
            }
        </>
    )
}

export default LayLoad
