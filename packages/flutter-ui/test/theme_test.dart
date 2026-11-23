import 'package:dosa_ui/dosa_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  test('brand colours are exact', () {
    expect(DosaPalette.brandMidnightInk, const Color(0xFF202039));
    expect(DosaPalette.brandRoyalViolet, const Color(0xFF7564E8));
    expect(DosaPalette.brandSaffron, const Color(0xFFE9A23B));
    expect(DosaPalette.brandMint, const Color(0xFF35B99A));
  });

  test('every theme builds ThemeData with the DosaTheme extension', () {
    expect(DosaThemeTokens.all, hasLength(5));
    for (final tokens in DosaThemeTokens.all) {
      final theme = buildDosaTheme(tokens);
      expect(theme.extension<DosaTheme>()!.tokens.name, tokens.name);
      expect(theme.brightness == Brightness.dark, tokens.isDark, reason: tokens.name);
      expect(theme.colorScheme.primary, tokens.actionPrimaryBg);
    }
  });

  test('numeric styles use tabular figures', () {
    for (final s in [DosaTypeScale.numericHero, DosaTypeScale.numericMd, DosaTypeScale.numericTimer]) {
      expect(s.fontFeatures, contains(const FontFeature.tabularFigures()));
    }
  });

  testWidgets('DosaTheme.of resolves inside a themed tree', (tester) async {
    late DosaThemeTokens seen;
    await tester.pumpWidget(MaterialApp(
      theme: buildDosaTheme(DosaThemeTokens.customerWarm),
      home: Builder(builder: (context) {
        seen = DosaTheme.of(context);
        return const SizedBox();
      }),
    ));
    expect(seen.name, 'customer-warm');
  });
}
