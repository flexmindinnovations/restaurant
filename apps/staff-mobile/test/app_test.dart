import 'package:dosa_staff/src/app.dart';
import 'package:dosa_ui/dosa_ui.dart';
import 'package:dosa_ui/testing.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';

void main() {
  setUpAll(loadDosaFonts);

  Future<void> pumpApp(WidgetTester tester, {bool kitchen = false}) async {
    tester.view.physicalSize = const Size(390 * 2, 1200 * 2);
    tester.view.devicePixelRatio = 2;
    addTearDown(tester.view.reset);
    await tester.pumpWidget(DosaStaffApp(initialKitchenMode: kitchen));
    // Lottie loads asynchronously; give it real time, then settle a frame.
    await tester.runAsync(() => Future<void>.delayed(const Duration(milliseconds: 300)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 800));
  }

  testWidgets('uses the staff light theme by default and toggles kitchen mode', (tester) async {
    await pumpApp(tester);
    BuildContext ctx = tester.element(find.text('Staff foundations'));
    expect(DosaTheme.of(ctx).name, 'staff-light');

    await tester.tap(find.byTooltip('Switch to kitchen mode'));
    await tester.pump(); // starts the theme animation
    await tester.pump(const Duration(seconds: 1)); // and lets it finish
    ctx = tester.element(find.text('Staff foundations'));
    expect(DosaTheme.of(ctx).name, 'staff-kitchen');
  });

  testWidgets('shows every order status with text', (tester) async {
    await pumpApp(tester);
    for (final s in DosaOrderStatus.values) {
      expect(find.byType(DosaOrderStatusBadge), findsWidgets);
      if (s != DosaOrderStatus.delayed) expect(find.text(s.label), findsWidgets);
    }
    expect(find.text('Delayed 6 min'), findsOneWidget);
  });

  testWidgets('golden: staff light', (tester) async {
    await pumpApp(tester);
    await expectLater(find.byType(DosaStaffApp), matchesGoldenFile('goldens/staff-light.png'));
  });

  testWidgets('golden: staff kitchen', (tester) async {
    await pumpApp(tester, kitchen: true);
    await expectLater(find.byType(DosaStaffApp), matchesGoldenFile('goldens/staff-kitchen.png'));
  });
}
