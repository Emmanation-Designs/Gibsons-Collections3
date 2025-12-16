import React, { useState, useRef, useEffect } from 'react';
import { Product, ADMIN_EMAILS } from '../types';
import { useStore } from '../store/useStore';
import { ShoppingBag, Heart, Trash2, Loader2, MoreVertical, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
}

const extractErrorMessage = (err: any): string => {
  if (!err) return 'An unknown error occurred.';
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  if (typeof err === 'object') {
    if (err.message) return err.message;
    if (err.error_description) return err.error_description;
    try {
      const json = JSON.stringify(err);
      if (json !== '{}' && !json.includes('[object Object]')) return json;
    } catch { /* ignore */ }
  }
  return 'Failed to perform action.';
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const { addToCart, toggleWishlist, wishlist, user } = useStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(product.id);
  // Case-insensitive check
  const isAdmin = user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());

  // Fallback image if array is empty or invalid
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : `https://picsum.photos/seed/${product.id}/300/300`;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;
      
      if (onDelete) {
        onDelete(product.id);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(`Delete failed: ${extractErrorMessage(error)}`);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/upload?id=${product.id}`);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300 relative group">
      <div className="relative aspect-square bg-gray-50">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition text-gray-600 z-10"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Admin Menu */}
        {isAdmin && (
          <div className="absolute top-2 left-2 z-20" ref={menuRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-700 transition shadow-sm"
              title="Admin Options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                <button 
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs text-secondary font-medium uppercase tracking-wide">{product.category}</p>
          {product.quantity && product.quantity > 0 && (
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {product.quantity} Left
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2 mb-2 flex-grow">{product.name}</h3>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₦{product.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart(product)}
            className="p-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};