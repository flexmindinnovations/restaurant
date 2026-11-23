/// Test helpers for apps that use `dosa_ui` (import only from tests).
library;

import 'package:flutter/services.dart';

/// Loads the real DOSA fonts (Inter, Plus Jakarta Sans) and the Lucide icon font into the test
/// engine, so widget and golden tests render real glyphs instead of the Ahem test font.
Future<void> loadDosaFonts() async {
  Future<void> load(String family, String asset) async {
    final loader = FontLoader(family)..addFont(rootBundle.load(asset));
    await loader.load();
  }

  await load('packages/dosa_ui/Inter', 'packages/dosa_ui/fonts/InterVariable.ttf');
  await load('packages/dosa_ui/PlusJakartaSans', 'packages/dosa_ui/fonts/PlusJakartaSansVariable.ttf');
  await load('packages/lucide_icons_flutter/Lucide', 'packages/lucide_icons_flutter/assets/lucide.ttf');
}
