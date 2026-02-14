import "package:flutter/material.dart";

class TextForm extends StatelessWidget {
  final String labelText;
  final Function(String?) onSaved;
  final String? Function(String?) validator;

  const TextForm({
    super.key,
    required this.labelText,
    required this.onSaved,
    required this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: labelText,
        border: const OutlineInputBorder(),
      ),
      onSaved: onSaved,
      validator: validator,
    );
  }
  
}