// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

// function PaypalCancelPage() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Clear any pending order data
//     sessionStorage.removeItem("currentOrderId");
//   }, []);

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <Card className="max-w-md w-full text-center">
//         <CardHeader>
//           <CardTitle className="text-red-600 text-2xl">
//             Payment Cancelled
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Your PayPal payment was cancelled. No charges were made.</p>
//           <Button className="mt-4" onClick={() => navigate("/shop/account")}>
//             Return to Cart
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default PaypalCancelPage;

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { checkAuth } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function PaypalCancelPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Check authentication on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    // Clear any pending order data
    sessionStorage.removeItem("currentOrderId");
    
    // Redirect to login if not authenticated after loading
    if (!isLoading && !isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">Payment is Failed!</CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaypalCancelPage;

