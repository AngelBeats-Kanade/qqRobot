//以下为pixiv的搜寻api返回json数据的接口
export interface TitleCaptionTranslation {
    workTitle?: any;
    workCaption?: any;
}

export interface Datum {
    id: string;
    title: string;
    illustType: number;
    xRestrict: number;
    restrict: number;
    sl: number;
    url: string;
    description: string;
    tags: string[];
    userId: string;
    userName: string;
    width: number;
    height: number;
    pageCount: number;
    isBookmarkable: boolean;
    bookmarkData?: any;
    alt: string;
    titleCaptionTranslation: TitleCaptionTranslation;
    createDate: Date;
    updateDate: Date;
    isUnlisted: boolean;
    isMasked: boolean;
    profileImageUrl: string;
}

export interface BookmarkRange {
    min?: number;
    max?: any;
}

export interface IllustManga {
    data: Datum[];
    total: number;
    bookmarkRanges: BookmarkRange[];
}

export interface TitleCaptionTranslation2 {
    workTitle?: any;
    workCaption?: any;
}

export interface Recent {
    id: string;
    title: string;
    illustType: number;
    xRestrict: number;
    restrict: number;
    sl: number;
    url: string;
    description: string;
    tags: string[];
    userId: string;
    userName: string;
    width: number;
    height: number;
    pageCount: number;
    isBookmarkable: boolean;
    bookmarkData?: any;
    alt: string;
    titleCaptionTranslation: TitleCaptionTranslation2;
    createDate: Date;
    updateDate: Date;
    isUnlisted: boolean;
    isMasked: boolean;
    profileImageUrl: string;
}

export interface TitleCaptionTranslation3 {
    workTitle?: any;
    workCaption?: any;
}

export interface Permanent {
    id: string;
    title: string;
    illustType: number;
    xRestrict: number;
    restrict: number;
    sl: number;
    url: string;
    description: string;
    tags: string[];
    userId: string;
    userName: string;
    width: number;
    height: number;
    pageCount: number;
    isBookmarkable: boolean;
    bookmarkData?: any;
    alt: string;
    titleCaptionTranslation: TitleCaptionTranslation3;
    createDate: Date;
    updateDate: Date;
    isUnlisted: boolean;
    isMasked: boolean;
    profileImageUrl: string;
}

export interface Popular {
    recent: Recent[];
    permanent: Permanent[];
}

export interface Tag {
    [key: string]: string;
}

export interface TagTranslation {
    [key: string]: Tag
}

export interface Header {
    url: string;
}

export interface Footer {
    url: string;
}

export interface Infeed {
    url: string;
}

export interface ZoneConfig {
    header: Header;
    footer: Footer;
    infeed: Infeed;
}

export interface AlternateLanguages {
    ja: string;
    en: string;
}

export interface Meta {
    title: string;
    description: string;
    canonical: string;
    alternateLanguages: AlternateLanguages;
    descriptionHeader: string;
}

export interface ExtraData {
    meta: Meta;
}

export interface Body {
    illustManga: IllustManga;
    popular: Popular;
    relatedTags: string[];
    tagTranslation: TagTranslation;
    zoneConfig: ZoneConfig;
    extraData: ExtraData;
}

export interface PixivSearchData {
    error: boolean;
    body: Body;
}

//以下为pixiv每日排名api返回的json数据的接口
export interface IllustContentType {
    sexual: number;
    lo: boolean;
    grotesque: boolean;
    violent: boolean;
    homosexual: boolean;
    drug: boolean;
    thoughts: boolean;
    antisocial: boolean;
    religion: boolean;
    original: boolean;
    furry: boolean;
    bl: boolean;
    yuri: boolean;
}

export interface Content {
    title: string;
    date: string;
    tags: string[];
    url: string;
    illust_type: string;
    illust_book_style: string;
    illust_page_count: string;
    user_name: string;
    profile_img: string;
    illust_content_type: IllustContentType;
    illust_series: boolean;
    illust_id: number;
    width: number;
    height: number;
    user_id: number;
    rank: number;
    yes_rank: number;
    rating_count: number;
    view_count: number;
    illust_upload_timestamp: number;
    attr: string;
    is_bookmarked: boolean;
    bookmarkable: boolean;
}

export interface PixivRankData {
    contents: Content[];
    mode: string;
    content: string;
    page: number;
    prev: boolean;
    next: number;
    date: string;
    prev_date: string;
    next_date: boolean;
    rank_total: number;
}
