import './mainwin.css';

import PageRoutes from '../pageroutes';
import { useClassNames } from '../base';
import Sidebar0 from './sidebar/sidebar0';
import { ErrorBoundary, PageErrorFallback } from './errorboundary/errorboundary';

let CurrentWin: unknown;
export function SwitchWin(winToSwitch: unknown) {
    CurrentWin = winToSwitch;
}

interface MainWinProps {
    isSidebarVisible: boolean;
    winToView?: unknown;
    loginusersession?: unknown;
}

function MainWin({ isSidebarVisible }: MainWinProps) {
    const getClassNames = useClassNames();

    return (
        <div className="main-container">
            <Sidebar0 isVisible={isSidebarVisible} />
            <div id="mainDiv" className={getClassNames('layout')}>
                <ErrorBoundary fallback={<PageErrorFallback />}>
                    <PageRoutes />
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default MainWin;
