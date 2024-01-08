const scrollToTime = (el: React.RefObject<HTMLDivElement>, hour: number) => {
  const currentMinute = hour * 60;
  if (el.current) {
    el.current.scrollTop = (el.current.scrollHeight * currentMinute) / 1440;
  }
};

export default scrollToTime;
