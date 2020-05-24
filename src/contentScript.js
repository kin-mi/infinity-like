'use strict'
const observedElements = []
// ドキュメント自体の変更を監視
const documentObserver = () => {
  const option = { childList: true, subtree: true }
  const observer = new MutationObserver(findLikesListener)
  observer.observe(document.body, option)
}
const findLikesListener = () => {
  // RTやいいねのラッパー要素
  const elements = document.getElementsByClassName('r-1mdbhws')
  Array.from(elements).forEach((element) => {
    // いいね数の要素
    const target =
      element.childNodes[2].firstChild.firstChild.lastChild.firstChild
    // いいね数0の場合、要素無しの為除外
    if (target.nodeName === 'SPAN' && !observedElements.includes(target)) {
      const option = {
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
      }
      const observer = new MutationObserver(function (mutations) {
        observer.disconnect()
        mutations.forEach((mutation) => CountUp(mutation))
        observer.observe(target, option)
      })
      observer.observe(target, option)
      observedElements.push(target)
    }
  })
}
function CountUp(mutation) {
  const oldValue = String(mutation.oldValue)
  const newValue = String(mutation.target.textContent)
  const formatOldValue = oldValue.split(',').join('')
  const formatNewValue = newValue.split(',').join('')
  // 末尾が数字じゃない場合は何もしない（例：1万）
  if (isNaN(oldValue.slice(-1)) && isNaN(newValue.slice(-1))) {
    return
  }
  // newValueの方が大きい場合は何もしない
  if (formatNewValue > formatOldValue) return
  mutation.target.textContent = Number(
    Number(formatOldValue) + 1
  ).toLocaleString()
}
documentObserver()
