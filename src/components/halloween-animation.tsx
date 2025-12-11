"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface Pumpkin {
  id: number;
  startX: number;
  startY: number;
  currentY: number;
  currentX: number; // 現在のX座標（衝突後に横にずれる）
  delay: number;
  speed: number; // 落下速度
  velocityX: number; // 横方向の速度
  rotationSpeed: number; // 回転速度（度/フレーム）
  size: number;
  rotation: number;
  hasStopped: boolean;
  collidedWith: number[]; // 一度衝突したジャックオランタンのIDリスト（振動防止）
}

const PUMPKIN_COUNT = 40;

// 2つのジャックオランタンが衝突しているかチェック
function checkCollision(pumpkin1: Pumpkin, pumpkin2: Pumpkin): boolean {
  // SVGに余白があるため、少し重なっても許容する（負のマージン）
  const overlap = pumpkin1.size * 0.2; // サイズの20%まで重なりを許容

  // 早期終了：X軸の範囲チェックを先に行う（パフォーマンス最適化）
  // currentXを使用（衝突後に横にずれるため）
  if (
    pumpkin1.currentX >= pumpkin2.currentX + pumpkin2.size - overlap ||
    pumpkin1.currentX + pumpkin1.size - overlap <= pumpkin2.currentX
  ) {
    return false;
  }

  // Y軸の範囲チェック
  return (
    pumpkin1.currentY < pumpkin2.currentY + pumpkin2.size - overlap &&
    pumpkin1.currentY + pumpkin1.size - overlap > pumpkin2.currentY
  );
}

// 衝突時に横方向の速度と回転速度を計算
function calculateBounceVelocity(
  pumpkin: Pumpkin,
  collisionTarget: Pumpkin
): { velocityX: number; rotationSpeed: number } {
  // 衝突点からの方向を計算
  const pumpkinCenterX = pumpkin.currentX + pumpkin.size / 2;
  const targetCenterX = collisionTarget.currentX + collisionTarget.size / 2;
  const direction = pumpkinCenterX < targetCenterX ? -1 : 1; // 左にずれるか右にずれるか

  // 横方向の速度を設定（衝突の強さに応じて）
  const baseVelocity = 0.3 + Math.random() * 0.5; // 0.3-0.8 px/frame
  const velocityX = direction * baseVelocity;

  // 回転速度を設定（衝突の強さに応じて）
  const rotationSpeed = direction * (2 + Math.random() * 3); // 2-5 度/frame

  return { velocityX, rotationSpeed };
}

export function HalloweenAnimation() {
  const [pumpkins, setPumpkins] = useState<Pumpkin[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const pathname = usePathname();

  // ページ遷移を検知してアニメーションをリセット
  useEffect(() => {
    // 既存のアニメーションをクリーンアップ
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // 初期化：ランダムな位置・タイミング・速度のジャックオランタンを生成
    const initialPumpkins: Pumpkin[] = Array.from(
      { length: PUMPKIN_COUNT },
      (_, i) => {
        const windowWidth =
          typeof window !== "undefined" ? window.innerWidth : 1920;
        const size = 40 + Math.random() * 40; // 40-80px

        const initialX = Math.random() * (windowWidth - size);
        return {
          id: i,
          startX: initialX,
          startY: -size - Math.random() * 100, // 画面上部から開始
          currentY: -size - Math.random() * 100,
          currentX: initialX, // 初期X座標
          delay: Math.random() * 3000, // 0-3秒の遅延
          speed: 1.5 + Math.random() * 1.5, // 落下速度
          velocityX: 0, // 横方向の速度（初期は0）
          rotationSpeed: 0, // 回転速度（初期は0）
          size,
          rotation: Math.random() * 360,
          hasStopped: false,
          collidedWith: [], // 衝突済みリスト（初期は空）
        };
      }
    );

    setPumpkins(initialPumpkins);
    startTimeRef.current = Date.now();

    // アニメーションループ
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;

      setPumpkins((prev) => {
        const windowHeight =
          typeof window !== "undefined" ? window.innerHeight : 1080;

        // 停止しているジャックオランタンのリストを作成（衝突判定用）
        const stoppedPumpkins = prev.filter((p) => p.hasStopped);

        // 更新が必要な要素のみを処理（パフォーマンス最適化）
        let hasChanges = false;
        const updatedPumpkins = prev.map((pumpkin) => {
          // 遅延がまだ経過していない場合は更新しない
          if (elapsed < pumpkin.delay) {
            return pumpkin;
          }

          // 既に停止している場合は更新しない
          if (pumpkin.hasStopped) {
            return pumpkin;
          }

          hasChanges = true;

          // 横方向の移動と回転を適用
          const windowWidth =
            typeof window !== "undefined" ? window.innerWidth : 1920;
          let newX = pumpkin.currentX + pumpkin.velocityX;
          const newRotation = pumpkin.rotation + pumpkin.rotationSpeed;
          let newVelocityX = pumpkin.velocityX;

          // 画面端に当たったら横方向の速度を反転
          if (newX < 0) {
            newX = 0;
            newVelocityX = Math.abs(pumpkin.velocityX) * 0.5; // 反発係数
          } else if (newX > windowWidth - pumpkin.size) {
            newX = windowWidth - pumpkin.size;
            newVelocityX = -Math.abs(pumpkin.velocityX) * 0.5; // 反発係数
          }

          // 落下アニメーション
          const newY = pumpkin.currentY + pumpkin.speed;
          const bottomY = windowHeight - pumpkin.size;

          // 画面下に到達した場合
          if (newY >= bottomY) {
            return {
              ...pumpkin,
              currentY: bottomY,
              currentX: newX,
              rotation: newRotation,
              velocityX: newVelocityX,
              hasStopped: true,
            };
          }

          // 落下中に衝突チェック（停止しているジャックオランタンとの衝突）
          const tempPumpkin: Pumpkin = {
            ...pumpkin,
            currentX: newX,
            currentY: newY,
          };

          // 最適化：X軸が近い要素のみをチェック（パフォーマンス向上）
          const xRange = pumpkin.size * 1.5; // 検索範囲を制限
          for (const stopped of stoppedPumpkins) {
            // 既に衝突済みのジャックオランタンはスキップ（振動防止）
            if (pumpkin.collidedWith.includes(stopped.id)) {
              continue;
            }

            // X軸の距離を先にチェック
            const xDistance = Math.abs(
              newX + pumpkin.size / 2 - (stopped.currentX + stopped.size / 2)
            );
            if (xDistance > xRange) {
              continue; // 距離が遠い場合はスキップ
            }

            if (checkCollision(tempPumpkin, stopped)) {
              // 衝突した場合、横方向の速度と回転速度を設定
              const bounce = calculateBounceVelocity(pumpkin, stopped);

              // 衝突位置から少し上に戻して、横にずれながら落ち続ける
              const bounceY = newY - pumpkin.size * 0.1; // 少し上に戻す

              // 衝突済みリストに追加
              const newCollidedWith = [...pumpkin.collidedWith, stopped.id];

              return {
                ...pumpkin,
                currentY: bounceY,
                currentX: newX,
                rotation: newRotation,
                velocityX: bounce.velocityX,
                rotationSpeed: bounce.rotationSpeed,
                collidedWith: newCollidedWith, // 衝突済みリストを更新
                hasStopped: false, // 衝突後も落下を続ける
              };
            }
          }

          // 衝突がない場合、通常通り落下
          return {
            ...pumpkin,
            currentY: newY,
            currentX: newX,
            rotation: newRotation,
            velocityX: newVelocityX,
          };
        });

        // 変更がない場合は前の状態を返す（Reactの再レンダリングを防ぐ）
        return hasChanges ? updatedPumpkins : prev;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // クリーンアップ
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pathname]);

  // リサイズ時の対応
  useEffect(() => {
    const handleResize = () => {
      setPumpkins((prev) => {
        const windowWidth =
          typeof window !== "undefined" ? window.innerWidth : 1920;
        return prev.map((pumpkin) => ({
          ...pumpkin,
          startX: Math.min(pumpkin.startX, windowWidth - pumpkin.size),
          currentX: Math.min(pumpkin.currentX, windowWidth - pumpkin.size),
        }));
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {pumpkins.map((pumpkin) => (
        <div
          key={pumpkin.id}
          className="absolute"
          style={{
            left: `${pumpkin.startX}px`,
            top: `${pumpkin.startY}px`,
            width: `${pumpkin.size}px`,
            height: `${pumpkin.size}px`,
            transform: `translate(${pumpkin.currentX - pumpkin.startX}px, ${
              pumpkin.currentY - pumpkin.startY
            }px) rotate(${pumpkin.rotation}deg)`,
            // 停止した要素はwill-changeを削除してパフォーマンス向上
            willChange: pumpkin.hasStopped ? "auto" : "transform",
          }}
        >
          <Image
            src="/2025halloween.svg"
            alt=""
            width={pumpkin.size}
            height={pumpkin.size}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
