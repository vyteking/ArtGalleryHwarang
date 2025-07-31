import './headersearchbox.css'

function HeaderSearchBox() {
    return (
        <div id="searchbox" className={GetClassNames("layout")}>
            <form id="searchboxform" method="POST">
                <input type="text" id="searchboxinput"/>
                <button type="reset">Reset</button>
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default HeaderSearchBox;