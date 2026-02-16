import "package:flutter/material.dart";

class TextForm extends StatelessWidget {
  final String labelText;
  final Function(String?) onSaved;
  final String? Function(String?) validator;
  final TextInputType? keyboardType;

  const TextForm({
    super.key,
    required this.labelText,
    required this.onSaved,
    required this.validator,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: labelText,
        border: const OutlineInputBorder(),
      ),
      keyboardType: keyboardType,
      onSaved: onSaved,
      validator: validator,
    );
  }
  
}