import {
  ANCHOR_ROW_ACTIONS,
  ANCHOR_TABLE_HEADER,
  DEFAULT_ANCHOR_COUNT,
  DEFAULT_ANCHOR_COUNT_LABEL,
  DEFAULT_ANCHORS,
  DEFAULT_DATE_RANGE_LABEL,
  DEFAULT_DOWNLOAD_LABEL,
  DEFAULT_FILTERS_LABEL,
  DEFAULT_PAGE_SUBTITLE,
  DEFAULT_PAGE_TITLE,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_TOTAL_PAGES,
} from "../constants/anchors"

export const getAnchorsData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pageTitle: DEFAULT_PAGE_TITLE,
        pageSubtitle: DEFAULT_PAGE_SUBTITLE,
        anchorCountLabel: DEFAULT_ANCHOR_COUNT_LABEL,
        anchorCount: DEFAULT_ANCHOR_COUNT,
        searchPlaceholder: DEFAULT_SEARCH_PLACEHOLDER,
        filtersLabel: DEFAULT_FILTERS_LABEL,
        downloadLabel: DEFAULT_DOWNLOAD_LABEL,
        dateRangeLabel: DEFAULT_DATE_RANGE_LABEL,
        tableHeader: ANCHOR_TABLE_HEADER,
        anchors: DEFAULT_ANCHORS,
        rowActions: ANCHOR_ROW_ACTIONS,
        totalPages: DEFAULT_TOTAL_PAGES,
      })
    }, 300)
  })
}
