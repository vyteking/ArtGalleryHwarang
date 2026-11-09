import { useClassNames } from '../base';
import './trending.css';

// Placeholder until the trending posts API exists.
function TrendingPostsList() {
    const getClassNames = useClassNames();

    return (
        <div id="trendingpostslist" className={getClassNames('')}>
            <div id="trendingpostitem" />
        </div>
    );
}

export default TrendingPostsList;
