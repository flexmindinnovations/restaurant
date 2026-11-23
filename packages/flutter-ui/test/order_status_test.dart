import 'package:dosa_ui/dosa_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  testWidgets('every order status shows an icon and a label in its theme colour', (tester) async {
    for (final tokens in [DosaThemeTokens.staffLight, DosaThemeTokens.staffKitchen]) {
      await tester.pumpWidget(MaterialApp(
        theme: buildDosaTheme(tokens),
        home: Scaffold(
          body: Wrap(children: [for (final s in DosaOrderStatus.values) DosaOrderStatusBadge(s)]),
        ),
      ));
      await tester.pumpAndSettle(); // MaterialApp animates between themes.
      for (final s in DosaOrderStatus.values) {
        expect(find.text(s.label), findsOneWidget);
        final icon = tester.widget<Icon>(find.byIcon(s.icon));
        expect(icon.color, s.color(tokens), reason: '${tokens.name}/${s.name}');
      }
    }
  });

  testWidgets('badge exposes the status to screen readers', (tester) async {
    final handle = tester.ensureSemantics();
    await tester.pumpWidget(MaterialApp(
      theme: buildDosaTheme(DosaThemeTokens.staffLight),
      home: const Scaffold(body: Center(child: DosaOrderStatusBadge(DosaOrderStatus.delayed, label: 'Delayed 6 min'))),
    ));
    expect(find.bySemanticsLabel('Order status: Delayed 6 min'), findsOneWidget);
    handle.dispose();
  });
}
