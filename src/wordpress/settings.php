<?php
	$O = Igemutato::OPTION_NAME;
	$options = Igemutato::validate_options(get_option($O));
?>
<div class="wrap">
	<h2>Igemutató beállítások</h2>
	<form method="post" action="options.php">
		<?php
		settings_fields('igemutato-settings');
		?>	
		<table class="form-table">
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[forditas]";?>">Fordítás</label></th>
				<td>
					<select id="<?php echo $O."[forditas]";?>" name="<?php echo $O."[forditas]";?>">
						<option value="KNB" <?php selected($options['forditas'], 'KNB', true);?>>Káldi-Neovulgáta (katolikus)</option>
						<option value="SZIT" <?php selected($options['forditas'], 'SZIT', true);?>>Szent István Társulati Biblia (katolikus)</option>
						<option value="KG" <?php selected($options['forditas'], 'KG', true);?>>Károli Gáspár revideált fordítása (protestáns)</option>
						<option value="UF" <?php selected($options['forditas'], 'UF', true);?>>Magyar Bibliatársulat újfordítású Bibliája 1990 (protestáns)</option>
						<option value="RUF" <?php selected($options['forditas'], 'RUF', true);?>>Magyar Bibliatársulat újfordítású Bibliája 2014 (protestáns)</option>
						<option value="BD" <?php selected($options['forditas'], 'BD', true);?>>Békés-Dalos Újszövetség</option>
						<option value="STL" <?php selected($options['forditas'], 'STL', true);?>>Simon T. László OSB Újszövetség-fordítása</option>
					</select>
					<span class="description">Ebből a fordításból jelennek meg az idézett szövegek.</span>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[tipH]";?>">Felugró ablak magassága</label></th>
				<td><input type="text" class="small-text" id="<?php echo $O."[tipH]";?>" name="<?php echo $O."[tipH]";?>" value="<?php echo esc_attr($options['tipH']);?>"/>
				<span class="description">A megjelenő szövegablak magassága (px)</span>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[tipW]";?>">Felugró ablak szélessége</label></th>
				<td><input type="text" class="small-text" id="<?php echo $O."[tipW]";?>" name="<?php echo $O."[tipW]";?>" value="<?php echo esc_attr($options['tipW']);?>"/>
				<span class="description">A megjelenő szövegablak szélessége (px)</span>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[fontSize]";?>">Betűméret</label></th>
				<td><input type="text" class="small-text" id="<?php echo $O."[fontSize]";?>" name="<?php echo $O."[fontSize]";?>" value="<?php echo esc_attr($options['fontSize']);?>"/>
				<span class="description">Az idézett szöveg betűmérete (px)</span>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[tipShow]";?>">Megjelenítési késleltetés</label></th>
				<td><input type="text" class="small-text" id="<?php echo $O."[tipShow]";?>" name="<?php echo $O."[tipShow]";?>" value="<?php echo esc_attr($options['tipShow']);?>"/>
				<span class="description">Egy hivatkozásra mutatva ennyi idő (msec) múlva jelenik meg a felugró ablak</span>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[tipHide]";?>">Elrejtési késleltetés</label></th>
				<td><input type="text" class="small-text" id="<?php echo $O."[tipHide]";?>" name="<?php echo $O."[tipHide]";?>" value="<?php echo esc_attr($options['tipHide']);?>"/>
				<span class="description">Ennyi idő (msec) múlva tűnik el a felugró ablak</span>
			</tr>			
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[excludeTags]";?>">Kizárt elemek</label></th>
				<td><input type="text" class="regular-text" id="<?php echo $O."[excludeTags]";?>" name="<?php echo $O."[excludeTags]";?>" value="<?php echo esc_attr($options['excludeTags']);?>"/>
					<span class="description">Ezekben a HTML elemekben nem jelennek meg hivatkozások</span>
				</td>
			</tr>		
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[enableFormatting]";?>">Szövegformázás engedélyezése</label></th>
				<td><input type="checkbox" id="<?php echo $O."[enableFormatting]";?>" name="<?php echo $O."[enableFormatting]";?>" <?php checked($options['enableFormatting'], true); ?>"/>
					<span class="description">Ha be van kapcsolva, bizonyos szövegrészek formázva jelennek meg</span>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><label for="<?php echo $O."[showNumbers]";?>">Fejezet- és versszámok megjelenítése</label></th>
				<td><input type="checkbox" id="<?php echo $O."[showNumbers]";?>" name="<?php echo $O."[showNumbers]";?>" <?php checked($options['showNumbers'], true); ?>"/>
					<span class="description">Ha be van kapcsolva, a számok is látszanak a szövegben</span>
				</td>
			</tr>
		</table>
		<p class="submit"><input type="submit" class="button-primary" value="Mentés" /></p>
	</form>
	<p class="description">A bővítmény és a felhasznált szkriptek teljes forráskódja megtalálható a <a href="https://github.com/molnarm/igemutato">https://github.com/molnarm/igemutato</a> oldalon.</p>
</div>
