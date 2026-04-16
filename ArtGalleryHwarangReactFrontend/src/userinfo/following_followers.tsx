import { useParams } from 'react-router-dom';
import './following_followers.css';
import { useClassNames } from '../base';

interface UserGridProps {
    userindex1st: string | number;
}

interface UserBarProps {
    userindex1st: string | number;
}

function UserGrid({ userindex1st }: UserGridProps) {
    const getClassNames = useClassNames();
    return (
        <div id="userGrid" className={getClassNames('')}>
        </div>
    );
}

function UserBar({ userindex1st }: UserBarProps) {
    const getClassNames = useClassNames();
    return (
        <div id="userbar" className={getClassNames('')}>
        </div>
    );
}

export function FollowingList() {
    const { userInfo } = useParams();
    const getClassNames = useClassNames();

    return (
        <div id="following" className={getClassNames('')}>
        </div>
    );
}

export function FollowersList() {
    const { userInfo } = useParams();
    const getClassNames = useClassNames();

    return (
        <div id="followers" className={getClassNames('')}>
        </div>
    );
}
