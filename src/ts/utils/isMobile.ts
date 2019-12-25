/**
 * スマートフォン、タブレットならtrue
 */
export default (): Boolean => {
  return !!navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i);
};
