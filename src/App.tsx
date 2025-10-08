import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout
 from "./layout/AppLayout"
import HomePage from "./pages/user/Home/HomePage"
import LoginPage from "./pages/user/Auth/LoginPage"
import RegisterPage from "./pages/user/Auth/RegisterPage"
import ProductDetailPage from "./pages/user/Product/ProductDetailPage"
import PrivateRoute from "./components/Auth/PrivateRoute"
import AdminLayout from "./layout/AdminLayout"
import ProductListPage from "./pages/admin/ProductManagement/ProductList"
import AddProductPage from "./pages/admin/ProductManagement/AddProductPage"
import CategoryListPage from "./pages/admin/CategoryManagement/CategoryList"
import AddEditCategoryPage from "./pages/admin/CategoryManagement/AddEditCategory"
import ContentListPage from "./pages/admin/ContentManagement/ContentList"
import EditContentPage from "./pages/admin/ContentManagement/EditContent"
import { AuthProvider } from "./hooks/useAuth"
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage"
import AboutUsPage from "./pages/publicPages/ContentPages/AboutUsPage"
import FAQPage from "./pages/publicPages/ContentPages/FAQPage"
import TermsConditionsPage from "./pages/publicPages/ContentPages/TermsConditionsPage"
import SearchPage from "./pages/user/Search/SearchPage"
import ReviewModerationPage from "./pages/admin/ReviewManagement/ReviewModeration"
import ErrorBoundary from "./components/Error/ErrorBoundary"
import CartPage from "./pages/user/Cart/CartPage"
import CheckoutPage from "./pages/user/Checkout/CheckoutPage"
import OrderConfirmationPage from "./pages/user/OrderConfirmation/OrderConfirmationPage"
import EditProductPage from "./pages/admin/ProductManagement/EditProductPage"
import EditVariantPage from "./pages/admin/ProductManagement/EditVariantPage"
import EditVariantImagesPage from "./pages/admin/ProductManagement/EditVariantImagesPage"
import ViewAllCategory from "./pages/user/Category/ViewAllCategory"

function App() {

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/register",
      element: <RegisterPage/>
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage/>
    },
    {
      path: "/",
      element: <AppLayout/>,
      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/about", // Route for About Us page
          element: <AboutUsPage />
        },
        {
          path: "/faq", // Route for FAQ page
          element: <FAQPage />
        },
        {
          path: "/terms", // Route for Terms and Conditions page
          element: <TermsConditionsPage />
        },
        {
          path: "/product/:id", // Route for product details
          element: <ProductDetailPage />
        },
        {
          path: "/product/:id/:variantId?",
          element: <ProductDetailPage />
        },
        {
          path: "/search",
          element: <SearchPage />,
        },
        {
          path: "/view-all-categories",
          element: <ViewAllCategory />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/checkout",
          element: (
            <PrivateRoute roles={["USER"]}>
              <CheckoutPage />
            </PrivateRoute>
          )
        },
        {
          path: "/order-confirmation/:orderId",
          element: <OrderConfirmationPage />
        }
      ]
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute roles={["ADMIN"]}>
          <AdminLayout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "products",
          element: <ProductListPage />,
        },
        {
          path: "products/add",
          element:(
            <ErrorBoundary>
            <AddProductPage />
            </ErrorBoundary>
          ),
        },
        { path: "products/edit/:productId", element: <EditProductPage /> },
        { path: "variants/edit/:variantId", element: <EditVariantPage /> },
        { path: "variants/edit-images/:variantId", element: <EditVariantImagesPage /> },
        {
          path: "categories",
          element: <CategoryListPage />,
        },
        {
          path: "categories/add",
          element: <AddEditCategoryPage />,
        },
        {
          path: "categories/edit/:id",
          element: <AddEditCategoryPage />,
        },
        {
          path: "reviews",
          element: <ReviewModerationPage />,
        },
        {
          path: "content",
          element: <ContentListPage />,
        },
        {
          path: "content/add", // Added route for adding new content
          element: <EditContentPage />,
        },
        {
          path: "content/edit/:key",
          element: <EditContentPage />,
        },
      ],
    }
  ])

  return (
    <>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </>
  )
}

export default App
