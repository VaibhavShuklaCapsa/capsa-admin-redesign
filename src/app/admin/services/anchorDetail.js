import {
  ANCHOR_DETAIL_ACTIONS,
  ANCHOR_DETAIL_TABS,
  DEFAULT_ANCHOR_DETAIL,
  DEFAULT_PAGE_SUBTITLE,
  DEFAULT_PAGE_TITLE,
} from "../constants/anchorDetail"

export const getAnchorDetailData = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pageTitle: DEFAULT_PAGE_TITLE,
        pageSubtitle: DEFAULT_PAGE_SUBTITLE,
        tabs: ANCHOR_DETAIL_TABS,
        actions: ANCHOR_DETAIL_ACTIONS,
        anchor: { ...DEFAULT_ANCHOR_DETAIL, id: id ?? DEFAULT_ANCHOR_DETAIL.id },
      })
    }, 300)
  })
}
