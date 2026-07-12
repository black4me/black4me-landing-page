"use client";

import React from 'react';
import ArticleAdSlot from './ArticleAdSlot';
import { AdSettings } from '@/types';

interface InlineArticleAdsProps {
  blocks: any[];
  settings: AdSettings | null;
  renderBlock: (block: any, index: number) => React.ReactNode;
}

export default function InlineArticleAds({ blocks, settings, renderBlock }: InlineArticleAdsProps) {
  if (!settings || !settings.enabled || settings.provider === 'disabled') {
    return <>{blocks.map((b, i) => renderBlock(b, i))}</>;
  }

  const renderedBlocks: React.ReactNode[] = [];
  let textBlockCount = 0;
  let afterIntroPlaced = false;
  let midContentPlaced = false;

  const totalTextBlocks = blocks.filter(b => b.type === 'text').length;
  const midPoint = Math.floor(totalTextBlocks / 2);

  blocks.forEach((block, index) => {
    renderedBlocks.push(renderBlock(block, index));

    if (block.type === 'text') {
      textBlockCount++;
      
      // after_intro: after 2nd text block
      if (textBlockCount === 2 && !afterIntroPlaced) {
        renderedBlocks.push(
          <ArticleAdSlot key={`ad-after-intro`} placement="after_intro" settings={settings} />
        );
        afterIntroPlaced = true;
      }
      
      // mid_content: around the middle text block, if we have enough blocks
      if (totalTextBlocks >= 4 && textBlockCount === Math.max(3, midPoint) && !midContentPlaced) {
        renderedBlocks.push(
          <ArticleAdSlot key={`ad-mid-content`} placement="mid_content" settings={settings} />
        );
        midContentPlaced = true;
      }
    }
  });

  // Add end_content ad at the very end
  renderedBlocks.push(
    <ArticleAdSlot key={`ad-end-content`} placement="end_content" settings={settings} />
  );

  return <>{renderedBlocks}</>;
}
