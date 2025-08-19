import { useParams } from 'react-router-dom';

import './following_followers.css'

import base, { GetClassNames, GetServerAPIAddress } from '../base';
import { useLocale } from '../locale/localeoptions';

function UserGrid({userindex1at}) {
    return (
        <div id='userGrid' className={GetClassNames('')}>

        </div>
    )
}

function UserBar({userindex1st}) {
    return (
        <div id='userbar' className={GetClassNames('')}>

        </div>
    )
}

export function FollowingList() {
    const {param} = useParams();

    return (
        <div id="following" className={GetClassNames('')}>

        </div>
    )
}

export function FollowersList() {
    const {param} = useParams();

    return (
        <div id="followers" className={GetClassNames('')}>

        </div>
    )
}