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

export interface PixivData {
    error: boolean;
    body: Body;
}
