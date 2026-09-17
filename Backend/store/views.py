from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer,UserSerializer
from rest_framework import status
from .models import Category, Product, Cart, CartItem,Order,OrderItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

    serializer = ProductSerializer(product)
    return Response(serializer.data)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)  # Assuming a single cart for simplicity
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)  # Assuming a single cart
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += 1
        item.save()
    return Response({'message': 'Product added to cart',"cart": CartSerializer(cart).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response(
            {'error': 'Item ID and Quantity are required'},
            status=400
        )

    try:
        item = CartItem.objects.get(id=item_id)

        quantity = int(quantity)

        if quantity < 1:
            item.delete()
            return Response(
                {'message': 'Item removed from cart'},
                status=200
            )

        item.quantity = quantity
        item.save()

        serializer = CartSerializer(item)
        return Response(serializer.data, status=200)

    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Cart Item not found'},
            status=404
        )

    except ValueError:
        return Response(
            {'error': 'Quantity must be a valid number'},
            status=400
        )               
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message': 'Product removed from cart'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method','COD')
        
        """
            VALIDATE PHONE NUMBER
        """    
        if not phone.isdigit() or len(phone) < 10:
            return Response({'error':'Invalid Phone Number'},status=400)
        
        '''Get user's Cart'''
        cart, created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error':'cart is empty'},status=400)

        total =  sum([item.product.price * item.quantity for item in cart.items.all()])


        order = Order.objects.create(user = request.user, total_price = total)

        for item in cart.items.all():
            OrderItem.objects.create(
                order = order,
                product = item.product,
                quantity = item.quantity,
                price = item.product.price
            )
        '''Clear the Cart'''
        cart.items.all().delete()
        return Response({'message':'Order Created successfully','order_id':order.id})
    except Exception as e:
        return Response({'error':str(e)},status=500)
        

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user_serializer = UserSerializer(user)
        return Response({"message":"User Created successfully ","user":UserSerializer(user).data}, status= status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)