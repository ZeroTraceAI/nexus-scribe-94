import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const questions: Record<string, { title: string; difficulty: string; topics: string[]; description: string; examples: string; hints: string[]; complexity: string }[]> = {
  "Arrays & Strings": [
    { title: "Two Sum", difficulty: "Easy", topics: ["Hash Map", "Arrays"], description: "Given an array of integers and a target sum, return indices of two numbers that add up to the target.", examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9", hints: ["Use a hash map to store complement values", "Single pass solution exists"], complexity: "Time: O(n), Space: O(n)" },
    { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topics: ["Sliding Window", "Hash Set"], description: "Find the length of the longest substring without repeating characters.", examples: "Input: s = 'abcabcbb'\nOutput: 3\nExplanation: 'abc' is the longest", hints: ["Sliding window technique", "Track characters in a set", "Move left pointer when duplicate found"], complexity: "Time: O(n), Space: O(min(m,n))" },
    { title: "Trapping Rain Water", difficulty: "Hard", topics: ["Two Pointers", "Stack", "DP"], description: "Given an elevation map, compute how much rain water can be trapped after raining.", examples: "Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6", hints: ["Track max height from left and right", "Two pointer approach is optimal", "Water at index = min(leftMax, rightMax) - height[i]"], complexity: "Time: O(n), Space: O(1)" },
  ],
  "Trees & Graphs": [
    { title: "Validate Binary Search Tree", difficulty: "Medium", topics: ["BST", "DFS", "Recursion"], description: "Determine if a given binary tree is a valid BST.", examples: "Input: root = [2,1,3]\nOutput: true", hints: ["Use min/max bounds", "In-order traversal should be sorted"], complexity: "Time: O(n), Space: O(h)" },
    { title: "Number of Islands", difficulty: "Medium", topics: ["BFS", "DFS", "Matrix"], description: "Count the number of islands in a 2D grid of '1's and '0's.", examples: "Input: grid = [['1','1','0'],['1','1','0'],['0','0','1']]\nOutput: 2", hints: ["DFS/BFS to mark visited cells", "Iterate through grid, start search on unvisited '1'"], complexity: "Time: O(m×n), Space: O(m×n)" },
  ],
  "Dynamic Programming": [
    { title: "Climbing Stairs", difficulty: "Easy", topics: ["DP", "Fibonacci"], description: "You can climb 1 or 2 steps. How many distinct ways to reach the top?", examples: "Input: n = 3\nOutput: 3\nExplanation: 1+1+1, 1+2, 2+1", hints: ["Each step depends on previous two steps", "dp[i] = dp[i-1] + dp[i-2]"], complexity: "Time: O(n), Space: O(1)" },
    { title: "Longest Increasing Subsequence", difficulty: "Medium", topics: ["DP", "Binary Search"], description: "Find the length of the longest strictly increasing subsequence.", examples: "Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: [2,3,7,101]", hints: ["O(n²) DP: dp[i] = max(dp[j]+1) for j<i where nums[j]<nums[i]", "O(n log n) with patience sorting"], complexity: "Time: O(n log n), Space: O(n)" },
  ],
  "System Design": [
    { title: "Design a URL Shortener", difficulty: "Medium", topics: ["Hash", "Database", "API"], description: "Design a system like bit.ly that shortens URLs and redirects users.", examples: "POST /shorten {url: 'https://example.com/very/long'} → {short: 'abc123'}\nGET /abc123 → 301 redirect", hints: ["Base62 encoding for short codes", "Consider hash collisions", "Cache popular URLs", "Analytics and rate limiting"], complexity: "Storage: ~100B per URL, Read-heavy workload" },
    { title: "Design a Rate Limiter", difficulty: "Medium", topics: ["Algorithm", "Redis", "Distributed"], description: "Design a rate limiter that limits API requests per user/IP.", examples: "Allow 100 requests per minute per user\n429 Too Many Requests when exceeded", hints: ["Token bucket or sliding window algorithm", "Use Redis for distributed rate limiting", "Consider fixed vs sliding windows"], complexity: "Time: O(1) per request" },
  ],
};

const CodingInterviewGenerator = () => {
  const [category, setCategory] = useState("Arrays & Strings");
  const [difficulty, setDifficulty] = useState("All");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const filtered = (questions[category] || []).filter(q => difficulty === "All" || q.difficulty === difficulty);

  const toggleReveal = (i: number) => {
    setRevealed(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Category</p>
          <Select value={category} onValueChange={v => { setCategory(v); setRevealed(new Set()); }}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(questions).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["All", "Easy", "Medium", "Hard"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <div className="p-4 bg-muted/30">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground">{q.title}</h3>
                <Badge variant={q.difficulty === "Easy" ? "secondary" : q.difficulty === "Medium" ? "outline" : "destructive"} className="text-xs">{q.difficulty}</Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {q.topics.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
              </div>
              <p className="text-sm text-foreground">{q.description}</p>
              <pre className="text-xs font-mono text-muted-foreground mt-2 bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">{q.examples}</pre>
            </div>

            <div className="p-4 border-t space-y-3">
              <Button variant="outline" size="sm" onClick={() => toggleReveal(i)}>{revealed.has(i) ? "Hide Hints & Solution" : "Show Hints & Solution"}</Button>
              {revealed.has(i) && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Hints</p>
                    <ul className="space-y-1">
                      {q.hints.map((h, j) => <li key={j} className="text-sm text-foreground flex items-start gap-2"><span className="text-primary">💡</span>{h}</li>)}
                    </ul>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Optimal Complexity</p>
                    <p className="text-sm font-mono text-primary">{q.complexity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No questions match the selected filters.</p>}
      </div>
    </div>
  );
};

export default CodingInterviewGenerator;
