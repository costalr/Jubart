from django.urls import path
from .views import RegisterView, LoginView, CleanTestUsersView, ProtectedView, DeleteUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('clean-test-users/', CleanTestUsersView.as_view(), name='clean_test_users'),
    path('protected/', ProtectedView.as_view(), name='protected'),
    path('delete-user/', DeleteUserView.as_view(), name='delete_user'),
]
