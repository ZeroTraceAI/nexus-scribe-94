import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Clock, Eye } from "lucide-react";
import type { BlogPost } from "@/data/posts";

const PostCard = forwardRef<HTMLAnchorElement, { post: BlogPost }>(({ post }, ref) => (
  <Link ref={ref} to={`/blog/${post.slug}`} className="group block">
    <article className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          width={640}
          height={360}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-0.5 mb-3 w-fit">
          {post.categoryName}
        </span>
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2" onClick={e => e.preventDefault()}>
            <img src={post.author.avatar} alt={post.author.name} width={20} height={20} className="h-5 w-5 rounded-full" loading="lazy" />
            <Link to={`/author/${post.author.name.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-primary transition-colors">{post.author.name}</Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTime}m</span>
            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{(post.viewCount / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </article>
  </Link>
));

PostCard.displayName = "PostCard";

export default PostCard;
