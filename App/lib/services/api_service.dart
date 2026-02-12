import 'package:dio/dio.dart';
import '../models/product.dart';

class ApiService {
  final Dio _dio;
  static const String baseUrl = 'http://localhost:5000/api';

  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));

  Future<List<Product>> getProducts() async {
    try {
      final response = await _dio.get('/products');
      final List<dynamic> data = response.data;
      return data.map((json) => Product.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error al obtener productos: $e');
    }
  }

  Future<Product> createProduct(Product product) async {
    try {
      final response = await _dio.post('/products', data: product.toJson());
      return Product.fromJson(response.data);
    } catch (e) {
      throw Exception('Error al crear producto: $e');
    }
  }
}
