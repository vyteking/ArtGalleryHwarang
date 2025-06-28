import Base from '../../base'

const theLocale = Base.localeoptions;
const langTxt = theLocale.localeTxt;

const VerticalLayoutOption = () => {
    return theLocale.isSupportingVerticalText ? (
        <tr id="EnableVerticalLayout">
            <td colSpan={2}><input type="checkbox" id="CheckboxEnableVerticalLayout"/>
            <label for="CheckboxEnableVerticalLayout">enable vertical layout</label></td>
        </tr>
    ) : null; // Return null if the condition is false
};

function Userinterfaceoptionwindow() {
    return () => {
        <div className='box'>
            <table>
                <tr>
                    <td>language</td>
                    <td></td>
                </tr>
                <VerticalLayoutOption />
                <tr>
                    <td><button>OK</button></td>
                    <td><button>Cancel</button></td>
                </tr>
            </table>
        </div>
    };
}

export default Userinterfaceoptionwindow;