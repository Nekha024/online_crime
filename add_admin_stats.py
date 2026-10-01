import os

with open('backend/core/admin_views.py', 'a') as f:
    f.write('''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    total_crimes = CrimeReport.objects.count()
    total_complaints = Complaint.objects.count()
    total_cases = total_crimes + total_complaints
    
    solved_crimes = CrimeReport.objects.filter(status__in=['Resolved', 'Closed']).count()
    solved_complaints = Complaint.objects.filter(status__in=['Resolved', 'Closed']).count()
    total_solved = solved_crimes + solved_complaints
    
    pending_crimes = CrimeReport.objects.exclude(status__in=['Resolved', 'Closed']).count()
    pending_complaints = Complaint.objects.exclude(status__in=['Resolved', 'Closed']).count()
    total_pending = pending_crimes + pending_complaints
    
    # Priority breakdown
    high_priority = CrimeReport.objects.filter(priority='High').count() + Complaint.objects.filter(priority='High').count()
    critical_priority = CrimeReport.objects.filter(priority='Critical').count() + Complaint.objects.filter(priority='Critical').count()
    
    # Recent 5 cases
    recent_crimes = CrimeReport.objects.order_by('-created_at')[:5]
    recent_cases_list = [{
        'id': c.crime_id,
        'title': c.title,
        'status': c.status,
        'date': c.created_at.strftime('%Y-%m-%d')
    } for c in recent_crimes]

    return Response({
        'success': True,
        'stats': {
            'total_cases': total_cases,
            'total_solved': total_solved,
            'total_pending': total_pending,
            'high_critical_cases': high_priority + critical_priority,
            'recent_cases': recent_cases_list
        }
    })
''')

with open('backend/core/admin_urls.py', 'r') as f:
    content = f.read()

if 'admin_dashboard_stats' not in content:
    content = content.replace("urlpatterns = [", "urlpatterns = [\n    path('dashboard-stats/', admin_views.admin_dashboard_stats, name='admin-dashboard-stats'),")
    with open('backend/core/admin_urls.py', 'w') as f:
        f.write(content)
print("Backend updated.")
