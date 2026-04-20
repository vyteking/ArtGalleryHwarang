export interface LocaleInfo {
    code: string;
    name: string;
    direction: number;
}

export interface LocaleFormat {
    number_decimal_separator: string;
    number_group_separator: string;
    dateformat: string;
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
    };
    statistic: {
        posts: PluralForm;
        following: PluralForm;
        followers: PluralForm;
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
    };
    userstatus: {
        SuspendedUser: string;
        NormalUser: string;
        Admin: string;
        Developer: string;
        ProjectManager: string;
        Founder: string;
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
    };
    replieslist: {
        lbl_Replies: string;
        reply_submission_error: string;
        no_replies: string;
        anonymous: string;
        tbx_reply_Placeholder: string;
        btn_submit_reply: string;
    };
    userinfopage?: {
        loading_user_info: string;
        user_not_found: string;
    };
    systemerror?: {
        error: string;
        network_error: string;
        page_not_found: string;
    };
}

export interface LocaleData {
    LocaleInfo: LocaleInfo;
    format: LocaleFormat;
    Texts: LocaleTexts;
}
