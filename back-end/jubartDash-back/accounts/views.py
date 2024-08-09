from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, LoginSerializer, CompanySerializer
from .models import Profile
from .renderers import CustomBrowsableAPIRenderer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    renderer_classes = [CustomBrowsableAPIRenderer]

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        print(f'Erro na autenticação: {serializer.errors}')
        return Response({'detail': 'Falha no login', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CleanTestUsersView(APIView):
    renderer_classes = [CustomBrowsableAPIRenderer]

    def post(self, request):
        test_profiles = Profile.objects.filter(is_test_user=True)
        count, _ = User.objects.filter(profile__in=test_profiles).delete()
        return Response({'message': f'{count} usuários de teste excluídos.'}, status=status.HTTP_200_OK)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    renderer_classes = [CustomBrowsableAPIRenderer]

    def get(self, request):
        return Response({"message": "Esta é uma view protegida!", "user": request.user.username})

class DeleteUserView(APIView):
    renderer_classes = [CustomBrowsableAPIRenderer]

    def post(self, request):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Nome de usuário não fornecido'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
            user.delete()
            return Response({'message': f'Usuário "{username}" excluído com sucesso.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
