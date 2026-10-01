with open('frontend/src/App.js', 'r') as f:
    content = f.read()

imports = '''
// Admin Portal Architecture
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStationManager from "./pages/admin/AdminStationManager";
import AdminStationStats from "./pages/admin/AdminStationStats";
import AdminBroadcast from "./pages/admin/AdminBroadcast";
import AdminQueries from "./pages/admin/AdminQueries";

'''

routes = '''
        {/* Isolated System Admin Portal */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="stations" element={<AdminStationManager />} />
          <Route path="stats" element={<AdminStationStats />} />
          <Route path="broadcast" element={<AdminBroadcast />} />
          <Route path="queries" element={<AdminQueries />} />
        </Route>
'''

content = content.replace('function LandingPage()', imports + 'function LandingPage()')
content = content.replace('{/* Fallback */}', routes + '\n        {/* Fallback */}')

with open('frontend/src/App.js', 'w') as f:
    f.write(content)

print('App.js updated')
