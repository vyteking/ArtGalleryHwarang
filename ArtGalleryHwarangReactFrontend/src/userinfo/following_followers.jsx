import { useParams } from 'react-router-dom';

import './following_followers.css'

import base, { useClassNames, GetServerAPIAddress } from '../base';
import { useLocale } from '../locale/localeoptions';

function UserGrid({userindex1at}) {
    const getClassNames = useClassNames();
    return (
        <div id='userGrid' className={getClassNames('')}>

        </div>
    )
}

function UserBar({userindex1st}) {
    const getClassNames = useClassNames();
    return (
        <div id='userbar' className={getClassNames('')}>

        </div>
    )
}

export function FollowingList() {
    const {param} = useParams();
    const getClassNames = useClassNames();

    return (
        <div id="following" className={getClassNames('')}>

        </div>
    )
}

export function FollowersList() {
    const {param} = useParams();
    const getClassNames = useClassNames();

    return (
        <div id="followers" className={getClassNames('')}>

        </div>
    )
}