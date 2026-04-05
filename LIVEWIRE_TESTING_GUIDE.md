# Quick Testing Guide - Livewire Pagination Fix

## What Was Fixed
The Livewire error `"Property type not supported in Livewire"` was caused by storing a Paginator object as a public component property. This has been fixed by:

1. ✅ Using Livewire's `WithPagination` trait
2. ✅ Handling pagination in the `render()` method
3. ✅ Separating CategoryFilter and ProductGrid responsibilities
4. ✅ Implementing proper event-based communication

## How to Test

### Step 1: Verify Component Files
```bash
# Check that these files were updated correctly
cat app/Livewire/Menu/ProductGrid.php        # Should have WithPagination trait
cat app/Livewire/Menu/CategoryFilter.php     # Should have event dispatchers
```

### Step 2: Clear Cache
```bash
php artisan view:clear
php artisan cache:clear
php artisan config:clear
```

### Step 3: Open Browser
```bash
# Start your local development server
php artisan serve
# Navigate to: http://localhost:8000/
```

### Step 4: Test Each Feature

#### Test 1: Category Filtering
1. Go to Menu section
2. Click "Coffee" button
3. ✓ Should show only coffee items
4. ✓ No page reload
5. ✓ No console errors

#### Test 2: Search Functionality
1. Go to Menu section
2. Type "espresso" in search box
3. ✓ Should filter products in real-time
4. ✓ No Livewire errors
5. ✓ Pagination should reset to page 1

#### Test 3: Pagination
1. Go to Menu section
2. Scroll down to bottom
3. Click "2" or "Next" button
4. ✓ Should load products from page 2
5. ✓ No "Property type not supported" error
6. ✓ Page stays on menu section

#### Test 4: Clear Filters
1. Apply a search or category filter
2. Click "Clear Filters" button
3. ✓ Search box should clear
4. ✓ Category button should reset to "All Items"
5. ✓ Products should reset to page 1 with all items

#### Test 5: Add to Cart
1. Filter products
2. Click "Add to Cart" on any product
3. ✓ Product should be added
4. ✓ Cart count should increase
5. ✓ Cart should update in real-time

### Step 5: Check Browser Console
Press `F12` to open Developer Tools → Console tab

✓ **Good signs:**
- No red JavaScript errors
- No "Property type not supported" messages
- No "undefined property" errors

❌ **Bad signs:**
- Red error messages about Livewire property types
- Blue warnings about console (these are usually OK)

### Step 6: Check Network Tab
1. Open Developer Tools → Network tab
2. Type in search box
3. Click category buttons
4. ✓ Should see Livewire AJAX requests (XHR)
5. ✓ Each request should return 200 status
6. ✓ Response should contain product HTML

## If You Still See Errors

### Error: "Property type not supported in Livewire"
**Solution:** 
- Make sure ProductGrid.php contains `use Livewire\WithPagination;`
- Make sure you cleared view cache: `php artisan view:clear`

### Error: "Call to undefined method resetPage()"
**Solution:**
- Make sure WithPagination trait is added to ProductGrid
- The trait provides the resetPage() method

### Products Not Filtering
**Solution:**
- Check browser console for errors
- Make sure CategoryFilter and ProductGrid are on same page
- Might need to refresh page (hard refresh: Ctrl+F5)

### Pagination Links Look Wrong
**Solution:**
- Make sure config/view.php exists and contains:
  ```php
  'pagination' => 'pagination::tailwind',
  ```

## Visual Checklist

- [ ] Menu section displays products
- [ ] Search box is visible and responsive
- [ ] Category buttons change on click
- [ ] Products update without page reload
- [ ] Pagination links work
- [ ] "Clear Filters" button appears when filters applied
- [ ] Add to Cart button works
- [ ] Cart updates in header
- [ ] Dark mode toggle still works
- [ ] Mobile responsive layout works

## Database Check (Optional)

Verify database is set up correctly:
```bash
# Check MongoDB connection
php artisan tinker

>>> use App\Models\Product;
>>> Product::count()  // Should return a number > 0
>>> exit;
```

## Performance Check

The app should feel snappy:
- ✓ Search results appear immediately (< 500ms)
- ✓ Category click instantly shows new items
- ✓ No lag when scrolling product cards
- ✓ Cart updates instantly

---

## Still Having Issues?

1. **Clear everything:**
   ```bash
   php artisan view:clear
   php artisan cache:clear
   php artisan config:clear
   rm -rf bootstrap/cache/*
   ```

2. **Check file permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

3. **Verify Livewire installation:**
   ```bash
   php artisan livewire:publish --assets
   ```

4. **Check logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

5. **Hard refresh browser:**
   - Chrome/Edge: `Ctrl+Shift+Del`
   - Firefox: `Ctrl+Shift+Delete`
   - Safari: `Cmd+Shift+Delete`

---

**Last Updated:** April 5, 2026  
**Status:** Ready for testing ✓
