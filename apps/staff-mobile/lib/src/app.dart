import 'package:dosa_ui/dosa_ui.dart';
import 'package:material_ui/material_ui.dart';

import 'foundations_screen.dart';

/// DOSA staff app root. Light by default; kitchen (dark) mode is a user toggle
/// (THEME_GUIDELINES §4). No product screens exist yet: home is a foundations check.
class DosaStaffApp extends StatefulWidget {
  const DosaStaffApp({super.key, this.initialKitchenMode = false});

  final bool initialKitchenMode;

  @override
  State<DosaStaffApp> createState() => _DosaStaffAppState();
}

class _DosaStaffAppState extends State<DosaStaffApp> {
  late bool _kitchenMode = widget.initialKitchenMode;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DOSA Staff',
      debugShowCheckedModeBanner: false,
      theme: buildDosaTheme(DosaThemeTokens.staffLight),
      darkTheme: buildDosaTheme(DosaThemeTokens.staffKitchen),
      themeMode: _kitchenMode ? ThemeMode.dark : ThemeMode.light,
      home: FoundationsScreen(
        kitchenMode: _kitchenMode,
        onKitchenModeChanged: (value) => setState(() => _kitchenMode = value),
      ),
    );
  }
}
