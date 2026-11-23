import 'package:dosa_ui/dosa_ui.dart';
import 'package:material_ui/material_ui.dart';

import 'foundations_screen.dart';

/// DOSA customer app root. Uses the warm customer theme only; system dark mode is not honoured
/// in this phase (THEME_GUIDELINES §4). No product screens exist yet: home is a foundations check.
class DosaCustomerApp extends StatelessWidget {
  const DosaCustomerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DOSA',
      debugShowCheckedModeBanner: false,
      theme: buildDosaTheme(DosaThemeTokens.customerWarm),
      themeMode: ThemeMode.light,
      home: const FoundationsScreen(),
    );
  }
}
