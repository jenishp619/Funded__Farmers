

function Logout() {
    localStorage.clear("cust_id");
    alert('Logout SuccessFull');
    window.location.href = "/";
};
export default Logout;
