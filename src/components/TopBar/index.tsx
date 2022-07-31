import top_mini from "@/assets/images/top_mini.png";
import top_max from "@/assets/images/top_max.png";
import top_close from "@/assets/images/top_close.png";

// TopBar的作用是显示 关闭/最小化/最大化的功能栏
const TopBar = () => {
  const miniSizeApp = () => {
    window.electron && window.electron.miniSizeApp();
  };

  const maxSizeApp = () => {
    window.electron && window.electron.maxSizeApp();
  };

  const closeApp = () => {
    window.electron && window.electron.closeApp();
  };

  return (
    <div className="top_bar">
      {window.electron && !window.electron.isMac && (
        <>
          <img onClick={closeApp} src={top_close} alt="" />
          <img onClick={maxSizeApp} src={top_max} alt="" />
          <img onClick={miniSizeApp} src={top_mini} alt="" />
        </>
      )}
    </div>
  );
};

export default TopBar;
