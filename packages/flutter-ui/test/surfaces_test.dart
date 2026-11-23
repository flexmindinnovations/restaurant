import 'package:dosa_ui/dosa_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';

Widget _app(DosaThemeTokens t, Widget child) =>
    MaterialApp(theme: buildDosaTheme(t), home: Scaffold(body: child));

void main() {
  for (final tokens in DosaThemeTokens.all) {
    testWidgets('glass, grain and mesh render in ${tokens.name}', (tester) async {
      await tester.pumpWidget(_app(
        tokens,
        DosaMeshBackground(
          child: Column(children: <Widget>[
            for (final v in DosaGlassVariant.values) DosaGlass(variant: v, child: Text(v.name)),
          ]),
        ),
      ));
      await tester.pumpAndSettle();
      expect(find.byType(BackdropFilter), findsNWidgets(DosaGlassVariant.values.length));
      expect(find.text('premium'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  }

  testWidgets('DosaGlassScope(enabled: false) removes BackdropFilter', (tester) async {
    await tester.pumpWidget(_app(
      DosaThemeTokens.staffLight,
      const DosaGlassScope(enabled: false, child: DosaGlass(child: Text('fallback'))),
    ));
    expect(find.byType(BackdropFilter), findsNothing);
    expect(find.text('fallback'), findsOneWidget);
  });
}
