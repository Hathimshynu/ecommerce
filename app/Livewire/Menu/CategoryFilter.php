<?php

namespace App\Livewire\Menu;

use Livewire\Component;
use Livewire\Attributes\On;
use App\Models\Category;

class CategoryFilter extends Component
{
    public $selectedCategory = null;
    public $searchQuery = '';
    public $categories = [];

    #[On('reset-filters')]
    public function resetFilters()
    {
        $this->selectedCategory = null;
        $this->searchQuery = '';
    }

    public function mount()
    {
        $this->categories = Category::where('is_active', true)->orderBy('sort_order')->get();
    }

    public function selectCategory($categoryId)
    {
        $this->selectedCategory = $categoryId;
        $this->dispatch('categorySelected', categoryId: $categoryId);
    }

    public function updatingSearchQuery()
    {
        $this->dispatch('searchUpdated', query: $this->searchQuery);
    }

    public function clearFilters()
    {
        $this->selectedCategory = null;
        $this->searchQuery = '';
        $this->dispatch('categoriesReset');
    }

    public function render()
    {
        return view('livewire.menu.category-filter');
    }
}
