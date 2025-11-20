import { useNavigate } from "react-router-dom";

const RandomUser = () => {
    const randomUserID = "";
    const navigate = useNavigate();
    const redirectToPage = () => {
        navigate("/u/"+randomUserID+"/");
    }

    return redirectToPage;
}