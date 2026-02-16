import 'package:flutter/material.dart';
import 'dart:typed_data';
import 'package:file_picker/file_picker.dart';
import 'package:resumenes_app/services/api_service.dart';
import 'package:resumenes_app/models/StudyNote.dart';

class CreateScreen extends StatefulWidget {
  const CreateScreen({super.key});

  @override
  State<CreateScreen> createState() => _CreateScreenState();
}

class _CreateScreenState extends State<CreateScreen> {
  final _formKey = GlobalKey<FormState>();
  String nombre = "";
  String descripcion = "";
  String? pdfFileName;
  Uint8List? pdfBytes;
  bool _isSubmitting = false;
  final ApiService apiService = ApiService();

  Future<void> _pickPdf() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
      withData: true,
    );

    if (result != null && result.files.isNotEmpty) {
      final file = result.files.first;
      setState(() {
        pdfFileName = file.name;
        pdfBytes = file.bytes;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Resumenes.net'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              const Text(
                'Crear Nuevo Resumen',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Nombre del Resumen',
                  border: OutlineInputBorder(),
                ),
                onSaved: (value) {
                  nombre = value!;
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa un nombre';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Descripción del Resumen',
                  border: OutlineInputBorder(),
                ),
                onSaved: (value) {
                  descripcion = value!;
                },
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Por favor ingresa una descripción';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              LayoutBuilder(
                builder: (context, constraints) {
                  final isNarrow = constraints.maxWidth < 320;
                  return isNarrow
                      ? Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              pdfFileName ?? 'Ningún PDF seleccionado',
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            ElevatedButton(
                              onPressed: _isSubmitting ? null : _pickPdf,
                              child: const Text('Seleccionar PDF'),
                            ),
                          ],
                        )
                      : Row(
                          children: [
                            Expanded(
                              child: Text(
                                pdfFileName ?? 'Ningún PDF seleccionado',
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              onPressed: _isSubmitting ? null : _pickPdf,
                              child: const Text('Seleccionar PDF'),
                            ),
                          ],
                        );
                },
              ),
              if (pdfBytes == null)
                const Padding(
                  padding: EdgeInsets.only(top: 8),
                  child: Text(
                    'Debes seleccionar un PDF',
                    style: TextStyle(color: Colors.red),
                  ),
                ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isSubmitting
                    ? null
                    : () async {
                        if (_formKey.currentState!.validate()) {
                          if (pdfBytes == null || pdfFileName == null) {
                            setState(() {});
                            return;
                          }

                          _formKey.currentState!.save();

                          setState(() {
                            _isSubmitting = true;
                          });

                          final uniqueFileName =
                              '${DateTime.now().millisecondsSinceEpoch}_$pdfFileName';

                          try {
                            final pdfLink = await apiService
                                .uploadPdfAndGetPublicUrl(
                                  fileBytes: pdfBytes!,
                                  fileName: uniqueFileName,
                                );

                            final note = StudyNote(
                              name: nombre,
                              description: descripcion,
                              pdfLink: pdfLink,
                            );

                            await apiService.createStudyNote(note);

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Resumen creado exitosamente'),
                                ),
                              );
                              Navigator.pop(context, true);
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Error: $e')),
                              );
                            }
                          } finally {
                            if (mounted) {
                              setState(() {
                                _isSubmitting = false;
                              });
                            }
                          }
                        }
                      },
                child: Text(_isSubmitting ? 'Subiendo...' : 'Crear Resumen'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
