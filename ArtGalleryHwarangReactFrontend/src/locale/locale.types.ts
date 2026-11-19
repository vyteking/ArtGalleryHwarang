export interface LocaleInfo {
    /** Language only, e.g. "zh", "ko", "pt". Not unique: zh-Hans and zh-Hant share "zh". */
    code: string;
    /** Language + script, e.g. "zh-Hant", "ko-Kore", "ru-Cyrl". */
    'code-variant': string;
    /** Language + region, e.g. "zh-TW", "ko-KR", "pt-BR". */
    'code-REGIONCODE': string;
    name: string;
    direction: number;
}

export interface LocaleFormat {
    number_decimal_separator: string;
    number_group_separator: string;
    standard_date_format: string;
}

export interface PluralForm {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
}

export interface LocaleTexts {
    webinfo: {
        name: string;
    };
    common: {
        OK: string;
        OK_Confirm_btn: string;
        Yes: string;
        No: string;
        Confirm: string;
        Cancel: string;
        Open: string;
        Close: string;
        Reset: string;
        View: string;
        Save: string;
        Post: string;
        Insert: string;
        Create: string;
        Submit: string;
        Update: string;
        Edit: string;
        Modify: string;
        Delete: string;
        Back: string;
    };
    statistic: {
        posts: PluralForm;
        following: PluralForm;
        followers: PluralForm;
        users: PluralForm;
        Replies: PluralForm;
    };
    statistic_with_count?: {
        posts: PluralForm;
        following: PluralForm;
        followers: PluralForm;
        Replies: PluralForm;
    };
    header: {
        menu: string;
    };
    sidebar0: {
        mainpage: string;
        hot: string;
        random_user_page: string;
        random_submission: string;
    };
    footer: {
        displayoptions: string;
    };
    userinfo: {
        userindex1st: string;
        userindex2nd: string;
        userindex3rd: string;
        userID: string;
        userpassword: string;
        userpassword2nd: string;
        userstatus: string;
        userlevel: string;
        userjoindate: string;
        useremail: string;
        userphonenumber: string;
        username: string;
        userdescription: string;
        useraltname: string;
    };
    useroptions: {
        Login: string;
        Logout: string;
        SignUp: string;
        notification: string;
        directmessage: string;
        add_account: string;
        settings: string;
    };
    login: {
        scr_Login: string;
        lbl_userId: string;
        lbl_userPW: string;
        tbx_userId_Placeholder: string;
        tbx_userPW_Placeholder: string;
        btn_Login: string;
        btn_Signup: string;
        btn_reset: string;
        error_AllFieldsRequired: string;
        error_InvalidCredentials: string;
    };
    signup: {
        scr_SignUp: string;
        lbl_UserId: string;
        tbx_UserId_Placeholder: string;
        lbl_ConfirmUserID: string;
        tbx_ConfirmUserID_Placeholder: string;
        lbl_UserPW: string;
        tbx_UserPW_Placeholder: string;
        lbl_ConfirmUserPW: string;
        tbx_ConfirmUserPW_Placeholder: string;
        btn_GoBack: string;
        btn_Reset: string;
        btn_Signup: string;
        error_AllFieldsRequired: string;
        error_UserIDsMismatch: string;
        error_PasswordsMismatch: string;
        error_UserIDExists: string;
    };
    userstatus: {
        SuspendedUser: string;
        NormalUser: string;
        Admin: string;
        Developer: string;
        ProjectManager: string;
        Founder: string;
    };
    userlevel: {
        UnrankedUser: string;
        BronzeUser: string;
        SilverUser: string;
        GoldUser: string;
        PlatinumUser: string;
    };
    userinterfaceoptions: {
        theme: string;
        theme_light: string;
        theme_dark: string;
        language: string;
        enable_vertical_direction: string;
    };
    postview: {
        prev_post: string;
        next_post: string;
        btn_Modify: string;
        btn_Delete: string;
        loading_post: string;
        post_not_found: string;
        post_error: string;
        unknown_author: string;
        more_from_artist: string;
        post_contents_placeholder: string;
        confirm_delete: string;
    };
    posteditor: {
        lbl_title: string;
        scr_EditPost: string;
        lbl_post_title: string;
        tbx_title_Placeholder: string;
        lbl_description: string;
        lbl_uploadfile: string;
        txt_description_Placeholder: string;
        lbl_tags: string;
        tbx_tags_Placeholder: string;
        btn_Submit: string;
        btn_Update: string;
        btn_Reset: string;
        btn_Cancel: string;
        error_login_required: string;
        error_load_failed: string;
        error_submit_failed: string;
        error_invalid_file_type: string;
        error_file_too_large: string;
    };
    replieslist: {
        lbl_Replies: string;
        reply_submission_error: string;
        no_replies: string;
        anonymous: string;
        tbx_reply_Placeholder: string;
        btn_submit_reply: string;
        btn_edit: string;
        btn_delete: string;
        btn_save: string;
        confirm_delete_reply: string;
        error_edit_failed: string;
        error_delete_failed: string;
    };
    homepage: {
        welcome_back: string;
        lbl_accounts: string;
        badge_current: string;
        btn_switch: string;
        btn_view_profile: string;
        btn_new_post: string;
        btn_logout_all: string;
        confirm_logout_all: string;
        welcome_title: string;
        welcome_subtitle: string;
    };
    userinfopage: {
        loading_user_info: string;
        user_not_found: string;
        load_error: string;
        not_set: string;
        no_following: string;
        no_followers: string;
        btn_edit_profile: string;
        edit_profile_title: string;
        tbx_username_placeholder: string;
        tbx_alt_name_placeholder: string;
        tbx_description_placeholder: string;
        btn_save_profile: string;
        profile_update_failed: string;
    };
    personalpage: {
        tab_all: string;
        tab_blogcontent: string;
        tab_image2d: string;
        tab_animation2d: string;
        tab_object3d: string;
        tab_audio: string;
        tab_video: string;
        show_more: string;
        show_less: string;
        no_submissions: string;
        load_more: string;
        loading_submissions: string;
        private: string;
        view_details: string;
    };
    systemerror: {
        error: string;
        network_error: string;
        page_not_found: string;
    };
    search: {
        tbx_search_Placeholder: string;
        btn_search: string;
        btn_reset: string;
    };
}

/** Shape of a locale JSON file (see localetemplate.json). */
export interface LocaleFile {
    LocaleInfo: LocaleInfo;
    format: LocaleFormat;
    Texts: LocaleTexts;
}

/** A loaded locale. `id` and `tag` are derived when the files are loaded; they are not in the JSON. */
export interface LocaleData extends LocaleFile {
    /** Unique locale ID = the file name without ".json", e.g. "en", "zh-Hant", "ko-HJ". Used for selection and storage. */
    id: string;
    /** Full BCP 47 tag (language-Script-REGION) built from LocaleInfo, e.g. "zh-Hant-TW". Used for Intl and <html lang>. */
    tag: string;
}
